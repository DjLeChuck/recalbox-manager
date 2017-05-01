import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Table from 'react-bootstrap/lib/Table';

const humanFileSize = (bytes, si = false) => {
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
};

const Monitoring = ({ t, loaded, cpus, ram, temperature, disks }) => (
  <div>
    <div className="page-header"><h1>{t("Monitoring")}</h1></div>

    <Loader loaded={loaded}>
      <h2>{t("Processeur")}</h2>
      <Row>
      {cpus.map((cpu, index) => {
        return (
          <Col key={index} md={6}>
            <p>{t("Cœur")} {index + 1}</p>

            <ProgressBar now={cpu.percent} label={`${cpu.percent}%`} />
          </Col>
        );
      })}
    </Row>

      <h2>{t("Mémoire")}</h2>
      <Row>
        <Col md={3}>
          <p>{t("Libre :")} {ram.free} MB</p>
        </Col>
        <Col md={6}>
          <ProgressBar now={ram.used} max={ram.total}
            label={`${ram.used_percent}%`} />
        </Col>
        <Col md={3}>
          <p>{t("Total :")} {ram.total} MB</p>
        </Col>
      </Row>

      <h2>{t("Température CPU")}</h2>
      <div className="clearfix">
        <div className={`c100 p${temperature.current_percent} ${temperature.color}`}>
          <span title={`${temperature.current}°c / ${temperature.max}°c`}>
            {temperature.current}°c
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
        {disks.map((disk, index) => (
          <tr key={index}>
            <td>{disk.name}</td>
            <td>{disk.mountOn}</td>
            <td>
              <ProgressBar now={disk.used} max={disk.total}
                label={disk.percent} />
            </td>
            <td>{humanFileSize(disk.used)}</td>
            <td>{humanFileSize(disk.free)}</td>
            <td>{humanFileSize(disk.total)}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </Loader>
  </div>
);

Monitoring.propTypes = {
  t: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  cpus: PropTypes.array.isRequired,
  ram: PropTypes.object.isRequired,
  temperature: PropTypes.object.isRequired,
  disks: PropTypes.array.isRequired,
};

export default translate()(Monitoring);
