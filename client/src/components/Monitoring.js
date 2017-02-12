import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Row, Col, ProgressBar, Table } from 'react-bootstrap';
import { get } from '../api';

class Monitoring extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      cpus: [],
      ram: {},
      temperature: {},
      disks: [],
    };
  }

  componentWillMount() {
    this.timer = setInterval(() => { this._fetchData(); }, 2500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  humanFileSize(bytes, si = false) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);

    return `${bytes.toFixed(1)} ${units[u]}`;
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <div className="page-header"><h1>{t("Monitoring")}</h1></div>

        <Loader loaded={this.state.isLoaded}>
          <h2>{t("Processeur")}</h2>
          <Row>
          {this.state.cpus.map((cpu, index) => {
            return (
              <Col key={index} md={6}>
                <p>Coeur {index + 1}</p>

                <ProgressBar now={cpu.percent} label={`${cpu.percent}%`} />
              </Col>
            );
          })}
        </Row>

          <h2>{t("Mémoire")}</h2>
          <Row>
            <Col md={3}>
              <p>{t("Libre :")} {this.state.ram.free} MB</p>
            </Col>
            <Col md={6}>
              <ProgressBar now={this.state.ram.used}
                max={this.state.ram.total}
                label={`${this.state.ram.used_percent}%`} />
            </Col>
            <Col md={3}>
              <p>{t("Total :")} {this.state.ram.total} MB</p>
            </Col>
          </Row>

          <h2>{t("Température CPU")}</h2>
          <div className="clearfix">
            <div className={`c100 p${this.state.temperature.current_percent} ${this.state.temperature.color}`}>
              <span title={`${this.state.temperature.current}°c / ${this.state.temperature.max}°c`}>
                {this.state.temperature.current}°c
              </span>
              <div className="slice">
                <div className="bar"></div>
                <div className="fill"></div>
              </div>
            </div>
          </div>

          <h2>{t("Systèmes de fichiers")}</h2>
          <Table responsive>
            <thead>
              <tr>
                <th>{t("Périphérique")}</th>
                <th>{t("Montage")}</th>
                <th>{t("Usage")}</th>
                <th>{t("Utilisé")}</th>
                <th>{t("Libre")}</th>
                <th>{t("Total")}</th>
              </tr>
            </thead>
            <tbody>
            {this.state.disks.map((disk, index) => {
              return (
                <tr key={index}>
                  <td>{disk.name}</td>
                  <td>{disk.mountOn}</td>
                  <td>
                    <ProgressBar now={disk.used} max={disk.total}
                      label={disk.percent} />
                  </td>
                  <td>{this.humanFileSize(disk.used)}</td>
                  <td>{this.humanFileSize(disk.free)}</td>
                  <td>{this.humanFileSize(disk.total)}</td>
                </tr>
              );
            })}
            </tbody>
          </Table>
        </Loader>
      </div>
    );
  }

  _fetchData() {
    const promises = [];

    promises.push(get('temperature'));
    promises.push(get('ram'));
    promises.push(get('disks'));
    promises.push(get('cpus'));

    Promise.all(promises).then((values) => {
      let newState = { isLoaded: true };

      for (const value of values) {
        Object.assign(newState, value);
      }

      this.setState(newState);
    }).catch((err) => {
      console.error(err);
    });
  }
}

export default translate()(Monitoring);
